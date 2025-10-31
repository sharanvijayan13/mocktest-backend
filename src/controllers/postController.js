import { supabase } from "../config/supabaseClient.js";

export const getAllPosts = async (_req, res) => {
  try {
    // Only return public posts (not drafts and not private)
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        body,
        user_id,
        created_at,
        updated_at,
        labels,
        is_private,
        users ( name, email )
      `)
      .eq("is_draft", false)
      .eq("is_private", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyPosts = async (req, res) => {
  const user_id = req.user.id;
  const { drafts_only, private_only } = req.query;
  
  try {
    let query = supabase
      .from("posts")
      .select(`id, title, body, user_id, created_at, updated_at, is_draft, is_private, labels`)
      .eq("user_id", user_id);

    if (drafts_only === 'true') {
      query = query.eq("is_draft", true);
    } else if (private_only === 'true') {
      query = query.eq("is_draft", false).eq("is_private", true);
    } else {
      // Public notes (published and not private)
      query = query.eq("is_draft", false).eq("is_private", false);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createPost = async (req, res) => {
  const { title, body, is_draft = false, is_private = false, labels = [] } = req.body;
  const user_id = req.user.id;

  // Debug logging
  console.log('📝 Creating post with data:', { title, body, is_draft, is_private, labels, user_id });
  console.log('📝 Labels type:', typeof labels, 'Labels length:', labels?.length);

  if (!title || !body) {
    return res.status(400).json({ message: "Please provide title and body" });
  }

  try {
    const insertData = { title, body, user_id, is_draft, is_private, labels };
    console.log('📤 Inserting to database:', insertData);

    const { data, error } = await supabase
      .from("posts")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log('✅ Post created successfully:', data);
    res.status(201).json(data);
  } catch (error) {
    console.error('❌ Create post error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, body, is_draft, is_private, labels } = req.body;
  const user_id = req.user.id;

  try {
    const { data: post, error: findError } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", id)
      .single();

    if (findError || !post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user_id !== user_id) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this post" });
    }

    const updateData = { title, body };
    if (is_draft !== undefined) {
      updateData.is_draft = is_draft;
    }
    if (is_private !== undefined) {
      updateData.is_private = is_private;
    }
    if (labels !== undefined) {
      updateData.labels = labels;
    }

    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const { data: post, error: findError } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", id)
      .single();

    if (findError || !post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user_id !== user_id) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this post" });
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;
    res.json({ message: "Post removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
