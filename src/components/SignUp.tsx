import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "80px",
  },
  form: {
    width: "320px",
    padding: "20px",
    borderRadius: "10px",
    background: "#f4f4f4",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "8px",
    background: "#444",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};


const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nick, setNick] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const auth = getAuth();
  const db = getDatabase();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // basic validations
    if (!nick.trim()) {
      setError("Enter a nickname");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userId = userCredential.user.uid;

      // 2️⃣ Save ONLY nickname as string
      await set(ref(db, `profile/${userId}`), nick);

      alert("Signup successful 🎉");

      // clear form
      setEmail("");
      setPassword("");
      setNick("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div style={styles.container}>
      <form onSubmit={handleSignup} style={styles.form}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Nickname"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

       <h3 style={{ marginTop: "15px", textAlign: "center" }}>
        <span style={{ fontStyle: "italic", color: "red" }}>
            To Login :
        </span>{" "}
        <button
            type="button"
            onClick={() => navigate("/")}
            style={{
            background: "none",
            border: "none",
            color: "#0066cc",
            cursor: "pointer",
            fontWeight: "bold",
            textDecoration: "underline",
            }}
        >
            Login
        </button>
        </h3>


      </form>
      
    </div>
       
    </>
  );
};

export default Signup;
