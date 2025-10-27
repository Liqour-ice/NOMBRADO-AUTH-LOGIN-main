import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signInWithGoogle, signInWithGithub, signInWithEmail, createUserWithEmail } from "../firebase";
import "../App.css";

function Home() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [viewMode, setViewMode] = useState("login"); // "login" | "signup"

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);
  const isLogin = viewMode === "login";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      const fu = result.user;
      setError("");
      login(fu.displayName || fu.email || "Google User", fu.email || "", fu.photoURL || null);
    } catch (err) {
      console.error("Google sign-in error", err);
      alert("Google sign-in failed");
    }
  };

  const handleGithub = async () => {
    try {
      const result = await signInWithGithub();
      const fu = result.user;
      setError("");
      login(fu.displayName || fu.email || "GitHub User", fu.email || "", fu.photoURL || null);
    } catch (err) {
      console.error("GitHub sign-in error", err);
      alert("GitHub sign-in failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        if (!formData.email.trim() || !formData.password.trim()) {
          setError("Please enter both email and password to sign in.");
          return;
        }
        setError("");
        // Attempt to sign in with email and password
        const result = await signInWithEmail(formData.email.trim(), formData.password.trim());
        const fu = result.user;
        login(fu.displayName || fu.email || "Email User", fu.email, fu.photoURL || null);
      } else {
        if (!formData.email.trim() || !formData.password.trim()) {
          setError("Please fill email and password to create an account.");
          return;
        }
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        if (!emailValid) {
          setError("Please enter a valid email address.");
          return;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long.");
          return;
        }
        setError("");
        // Create new account with email and password
        const result = await createUserWithEmail(formData.email.trim(), formData.password.trim());
        const fu = result.user;
        login(fu.email, fu.email, null);
      }
    } catch (err) {
      console.error("Authentication error:", err);
      if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else {
        console.error("Specific error code:", err.code);
        setError(`Authentication failed: ${err.message}`);
      }
    }
  };

  if (user) {
    return (
      <div className="center-wrap">
        <div className="frame">
          {/* header removed for a cleaner look */}

          <div className="cards show-login-only single-mode">
            <div className="card card-login" aria-hidden={viewMode === "signup"}>
              <div className="card-header">
                <span className="icon">🔐</span>
                <h2>Welcome!</h2>
                <p className="muted">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit}>
                <label className="field">
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                </label>
                <label className="field">
                  <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                </label>
                {error && <p className="muted small center" style={{ color: "red", marginTop: 8 }}>{error}</p>}

                <div className="row between small">
                  <label><input type="checkbox" /> remember me?</label>
                  <button type="button" className="link muted small">forgot password?</button>
                </div>

                <button type="submit" className="btn primary">Login ➜</button>

                <p className="muted small center" style={{ marginTop: 12 }}>
                  Or sign in with
                </p>
                <div className="socials center" style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    className="icon-btn google"
                    onClick={handleGoogle}
                    aria-label="Sign in with Google"
                  >
                    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path fill="#EA4335" d="M24 9.5c3.8 0 6.9 1.6 8.9 3l6.6-6.6C36.9 3.1 30.9 1 24 1 14.8 1 6.9 6.4 3.2 14.2l7.7 6C12.8 16 18 9.5 24 9.5z"/>
                      <path fill="#34A853" d="M46.5 24c0-1.6-.1-3.1-.4-4.5H24v8.5h12.8c-.6 3-2.6 5.6-5.6 7.3l8 6c4.7-4.3 7.3-10.9 7.3-17.3z"/>
                      <path fill="#FBBC05" d="M14.1 29.5c-1.1-3.2-.1-6.7 2.7-9.1l-7.7-6C4.6 17 3 20.4 3 24s1.6 7 4.1 9.6l7-4.1z"/>
                      <path fill="#4285F4" d="M24 46.9c6.9 0 12.9-2.3 17.3-6.2l-8-6c-2.5 1.7-5.6 2.7-9.3 2.7-6 0-11.2-4.8-12.3-11.1l-7 4.1C6.9 41.6 14.8 46.9 24 46.9z"/>
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="icon-btn github"
                    onClick={handleGithub}
                    aria-label="Sign in with GitHub"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path fill="currentColor" d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.18 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.21-1.49 3.18-1.18 3.18-1.18.63 1.57.23 2.73.11 3.02.74.8 1.19 1.83 1.19 3.09 0 4.42-2.71 5.39-5.29 5.67.42.36.79 1.07.79 2.15 0 1.55-.02 2.8-.02 3.18 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/>
                    </svg>
                  </button>
                 </div>

                <p className="muted small center" style={{ marginTop: 12 }}>
                  Don't have an account? <button className="link" onClick={() => setViewMode("signup")}>Create one</button>
                </p>
              </form>
            </div>

            <div className="card card-signup" aria-hidden={viewMode === "login"}>
              <div className="card-header">
                <span className="icon">👤</span>
                <h2>Create account!</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <label className="field">
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                </label>
                <label className="field">
                  <input name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" />
                </label>
                <label className="field">
                  <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                </label>
                {error && <p className="muted small center" style={{ color: "red", marginTop: 8 }}>{error}</p>}

                <button type="submit" className="btn primary">Create ➜</button>

                <p className="muted small center" style={{ marginTop: 12 }}>
                  Or create account using social media
                </p>
                <div className="socials center">
                  <button type="button" className="icon-btn" onClick={handleGoogle}>G</button>
                  <button type="button" className="icon-btn" onClick={handleGithub}>GH</button>
                </div>

                <p className="muted small center" style={{ marginTop: 12 }}>
                  Already have an account?{" "}
                  <button type="button" className="link" onClick={() => setViewMode("login")}>Sign in</button>
                </p>
              </form>
            </div>
          </div>

          <footer className="muted small center">© 2025 Nombrado-AUTH-LOGIN</footer>
        </div>
      </div>
    );
  }

  const cardsClass = viewMode === "login"
    ? "cards show-login-only single-mode"
    : "cards show-signup-only single-mode";

  return (
    <div className="center-wrap">
      <div className="frame">
        {/* header removed for a cleaner look */}

        <div className={cardsClass}>
          <div className="card card-login" aria-hidden={viewMode === "signup"}>
            <div className="card-header">
              <span className="icon">🔐</span>
              <h2>Welcome!</h2>
              <p className="muted">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="field">
                <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" />
              </label>
              <label className="field">
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" />
              </label>
              {error && <p className="muted small center" style={{ color: "red", marginTop: 8 }}>{error}</p>}

              <div className="row between small">
                <label><input type="checkbox" /> remember me?</label>
                <button type="button" className="link muted small">forgot password?</button>
              </div>

              <button type="submit" className="btn primary">Login ➜</button>

              <p className="muted small center" style={{ marginTop: 12 }}>
                Or sign in with
              </p>
              <div className="socials center" style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className="icon-btn google"
                  onClick={handleGoogle}
                  aria-label="Sign in with Google"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path fill="#EA4335" d="M24 9.5c3.8 0 6.9 1.6 8.9 3l6.6-6.6C36.9 3.1 30.9 1 24 1 14.8 1 6.9 6.4 3.2 14.2l7.7 6C12.8 16 18 9.5 24 9.5z"/>
                    <path fill="#34A853" d="M46.5 24c0-1.6-.1-3.1-.4-4.5H24v8.5h12.8c-.6 3-2.6 5.6-5.6 7.3l8 6c4.7-4.3 7.3-10.9 7.3-17.3z"/>
                    <path fill="#FBBC05" d="M14.1 29.5c-1.1-3.2-.1-6.7 2.7-9.1l-7.7-6C4.6 17 3 20.4 3 24s1.6 7 4.1 9.6l7-4.1z"/>
                    <path fill="#4285F4" d="M24 46.9c6.9 0 12.9-2.3 17.3-6.2l-8-6c-2.5 1.7-5.6 2.7-9.3 2.7-6 0-11.2-4.8-12.3-11.1l-7 4.1C6.9 41.6 14.8 46.9 24 46.9z"/>
                  </svg>
                </button>

                <button
                  type="button"
                  className="icon-btn github"
                  onClick={handleGithub}
                  aria-label="Sign in with GitHub"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path fill="currentColor" d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.18 1.18.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.21-1.49 3.18-1.18 3.18-1.18.63 1.57.23 2.73.11 3.02.74.8 1.19 1.83 1.19 3.09 0 4.42-2.71 5.39-5.29 5.67.42.36.79 1.07.79 2.15 0 1.55-.02 2.8-.02 3.18 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/>
                  </svg>
                </button>
               </div>

              <p className="muted small center" style={{ marginTop: 12 }}>
                Don't have an account? <button className="link" onClick={() => setViewMode("signup")}>Create one</button>
              </p>
            </form>
          </div>

          <div className="card card-signup" aria-hidden={viewMode === "login"}>
            <div className="card-header">
              <span className="icon">👤</span>
              <h2>Create account!</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="field">
                <input name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" type="email" />
              </label>
              <label className="field">
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" />
              </label>
              {error && <p className="muted small center" style={{ color: "red", marginTop: 8 }}>{error}</p>}

              <button type="submit" className="btn primary">Create ➜</button>

              <p className="muted small center" style={{ marginTop: 12 }}>
                Or create account using social media
              </p>
              <div className="socials center">
                <button type="button" className="icon-btn" onClick={handleGoogle}>G</button>
                <button type="button" className="icon-btn" onClick={handleGithub}>GH</button>
              </div>

              <p className="muted small center" style={{ marginTop: 12 }}>
                Already have an account?{" "}
                <button type="button" className="link" onClick={() => setViewMode("login")}>Sign in</button>
              </p>
            </form>
          </div>
        </div>

        <footer className="muted small center">© 2025 Nombrado-AUTH-LOGIN</footer>
      </div>
    </div>
  );
}

export default Home;