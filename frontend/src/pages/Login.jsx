const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    await login(email, password);

    toast.success("Login successful");

    // 🔥 FORCE UI UPDATE ROUTE FIX
    window.location.href = "/dashboard";
  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};