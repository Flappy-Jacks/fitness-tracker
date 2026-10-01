import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API = "http://localhost:8000";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token was provided.");
      return;
    }

    async function verifyEmail() {
      try {
        const response = await fetch(
          `${API}/auth/verify-email?token=${encodeURIComponent(token)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Verification failed");
        }

        setStatus("success");
        setMessage(data.message);
      } catch (error) {
        setStatus("error");
        setMessage(error.message);
      }
    }

    verifyEmail();
  }, [searchParams]);

  if (status === "verifying") {
    return <h1>Verifying your email...</h1>;
  }

  if (status === "error") {
    return (
      <div className="flex-col flex h-screen justify-center items-center w-full">
        <div className="pb-25">
          <h1 className="text-2xl font-bold">Verification failed</h1>
          <p>{message}</p>
          <Link to="/" className="text-primary cursor-pointer hover:underline underline-offset-2" >Go to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col flex h-screen justify-center items-center w-full">
      <div className="pb-25">
        <h1 className="text-2xl font-bold">Email verified!</h1>
        <p>{message}</p>
        <Link to="/" className="text-primary cursor-pointer hover:underline underline-offset-2" >Go to login</Link>
      </div>
    </div>
  );
}

export default VerifyEmail;
