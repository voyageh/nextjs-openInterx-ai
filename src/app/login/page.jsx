import { signIn } from "@/auth"
import Logo from "@/assets/images/login/logo.svg"
import Google from "@/assets/images/login/google.svg"
import "./index.scss"

export default function Login() {
  return (
    <div className="login-wrapper">
      <div className="login-main">
        <div className="logo-box">
          <Logo className="icon" />
          <div className="tips">
            Multimodal AI that understands videos like humans
          </div>
        </div>

        <div className="btn-box">
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/" })
            }}
          >
            <button className="login-btn">
              <Google className="icon" />
              <span className="text"> Log with Google</span>
            </button>
          </form>

          <div className="tips">No account? Sign up quickly with Google</div>
        </div>
      </div>
    </div>
  )
}
