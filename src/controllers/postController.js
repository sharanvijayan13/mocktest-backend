import { supabase } from "../config/supabaseClient.js";

export const getAllPosts = async (_req, res) => {
  try {
    const { data, error } = await supabase.from("posts").select(`
                id,
                title,
                body,
                user_id,
                users ( name, email )
            `);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyPosts = async (req, res) => {
  const user_id = req.user.id;
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`id, title, body, user_id, created_at, updated_at`)
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createPost = async (req, res) => {
  const { title, body } = req.body;
  const user_id = req.user.id;

  if (!title || !body) {
    return res.status(400).json({ message: "Please provide title and body" });
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, body, user_id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
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

    const { data, error } = await supabase
      .from("posts")
      .update({ title, body })
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
