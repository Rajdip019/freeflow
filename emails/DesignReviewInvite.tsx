import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

import { IS_EMAIL_DEV } from "../helpers/email-templates";
import HeroLogo from "../components/EmailTemplates/HeroLogo";

export interface DesignReviewInviteProps {
  designReviewUrl: string;
  designReviewPassword?: string;
  inviter: string;
}

export const DesignReviewInvite: React.FC<
  Readonly<DesignReviewInviteProps>
> = ({
  designReviewUrl = IS_EMAIL_DEV
    ? "http://localhost:3000/review-image/uJMlJ4ycvdZ4qLYGGQ5g"
    : "",
  designReviewPassword = IS_EMAIL_DEV ? "pass123" : "",
  inviter = IS_EMAIL_DEV ? "John Doe" : "",
}) => (
  <Html>
    <Preview>
      {inviter.toUpperCase()} requested your feedback on FreeFlow!
    </Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-white font-sans text-black">
        <Container className="my-8 w-[600px] rounded border border-solid border-gray-300 p-5 py-8">
          <HeroLogo />
          <Heading className="my-8 p-0 text-center text-2xl font-normal text-black">
            {inviter.toUpperCase()} requested your feedback on FreeFlow!
          </Heading>

          {designReviewPassword && (
            <Section className="mb-8">
              <Text className="text-center text-black">
                Password to access the design:{" "}
                <strong>{designReviewPassword}</strong>
              </Text>
            </Section>
          )}

          <Section className="flex items-center justify-center">
            <Button
              className="rounded-md bg-purple-500 px-8 py-4 text-center font-semibold text-white no-underline antialiased"
              href={designReviewUrl}
            >
              View Design
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default DesignReviewInvite;
