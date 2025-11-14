import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient();

type GithubSigninResponse = Promise<
  { success: true } | { success: false; msg: string }
>;

export const signinWithGithub = async (): GithubSigninResponse => {
  try {
    await authClient.signIn.social({ provider: "github" });
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Some error occurred!" };
  }
};
