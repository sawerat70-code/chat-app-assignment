import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import socket from "../socket";

const Register=({setUser})=>{
  const [name,setName]=useState("");
  const [email , setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit=async (e)=>{
    e.preventDefault();
    setError("");
    try{
      const res=await api.post("auth/register",{name,email,password});
      setUser(res.data.user);
      navigate("/chat");
    }catch(err){
      setError(err.response?.data?.message || "Registration failed");
    }
  };

 
  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">C</div>
        <h2>Create Account</h2>
{error && <div className="error">{error}</div>}
<div className="form-group">
        <label>Name</label>
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)}
        required />
</div>
<div className="form-group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
        required
         />
         </div>
<div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}
        required
         />
         </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn" >Register</button>

        <p className="muted center-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        </form>
      </div>
  );
};
export default Register;
