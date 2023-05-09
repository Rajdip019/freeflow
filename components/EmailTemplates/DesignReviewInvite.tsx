import * as React from "react";

export interface DesignReviewInviteProps {
  designReviewUrl: string;
  designReviewPassword?: string;
  inviter: string;
}

export const DesignReviewInvite: React.FC<
  Readonly<DesignReviewInviteProps>
> = ({ designReviewUrl, designReviewPassword = "", inviter }) => (
  <div>
    <h2>
      <strong>{inviter.toUpperCase()}</strong> requested your feedback on
      FreeFlow!
    </h2>
    <div style={{ marginTop: "16px" }}>
      <span>Design feedback link:</span>
      <br />
      <span>{designReviewUrl}</span>
    </div>
    {designReviewPassword && (
      <div style={{ marginTop: "16px" }}>
        <span>Password to access the design:</span>
        <br />
        <span>
          <strong>{designReviewPassword}</strong>
        </span>
      </div>
    )}
  </div>
);

export default DesignReviewInvite;
