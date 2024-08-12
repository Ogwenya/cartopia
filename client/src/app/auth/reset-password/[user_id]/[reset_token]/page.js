import PasswordResetForm from "./password-reset-form";

const PasswordResetPage = ({ params }) => {
  const { user_id, reset_token } = params;
  return <PasswordResetForm user_id={user_id} reset_token={reset_token} />;
};

export default PasswordResetPage;
