import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Link,
} from "@react-email/components";

type Props = {
  verificationLink: string;
  userName: string;
};

export default function VerifyEmail(params: Props) {
  const { verificationLink, userName } = params;

  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={message}>
            <Img
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}/snake-3.png`}
              width="65"
              height="73"
              alt="Case Master Logo"
              style={{ margin: "auto" }}
            />
            <Heading style={global.heading}>Verify Your Email Address</Heading>
            <Text style={global.text}>Hi {userName},</Text>
            <Text style={{ ...global.text, marginTop: 16 }}>
              Thanks for signing up with Case Master! To complete your
              registration, please verify your email address by clicking the
              button below.
            </Text>
            <Section style={{ textAlign: "center", marginTop: 24 }}>
              <Link
                href={verificationLink}
                target="_blank"
                rel="noopener noreferrer"
                style={global.button}
              >
                Verify Email
              </Link>
            </Section>
            <Text style={{ ...global.text, marginTop: 24 }}>
              If you didn’t sign up for Case Master, you can safely ignore this
              email.
            </Text>
          </Section>

          <Hr style={global.hr} />

          <Section style={paddingY}>
            <Row>
              <Text
                style={{
                  ...footer.text,
                  paddingTop: 30,
                  paddingBottom: 30,
                }}
              >
                Please contact us if you have any questions. (If you reply to
                this email, we won't be able to see it.)
              </Text>
            </Row>
            <Row>
              <Text style={footer.text}>
                © Case Master, Inc. All Rights Reserved.
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const paddingX = {
  paddingLeft: "40px",
  paddingRight: "40px",
};

const paddingY = {
  paddingTop: "22px",
  paddingBottom: "22px",
};

const paragraph = {
  margin: "0",
  lineHeight: "2",
};

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: "bold" },
  heading: {
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "-1px",
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: "#747474",
    fontWeight: "500",
  },
  button: {
    fontSize: "16px",
    textDecoration: "none",
    padding: "10px 20px",
    width: "220px",
    display: "inline-block",
    textAlign: "center",
    fontWeight: 500,
    color: "white",
    backgroundColor: "hsl(142.1 76.2% 36.3%)",
    borderRadius: "5px",
    cursor: "pointer",
  } as React.CSSProperties,
  hr: {
    borderColor: "#E5E5E5",
    margin: "0",
  },
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "10px auto",
  width: "600px",
  maxWidth: "100%",
  border: "1px solid #E5E5E5",
};

const message = {
  padding: "40px 74px",
  textAlign: "center",
} as React.CSSProperties;

const footer = {
  text: {
    margin: "0",
    color: "#AFAFAF",
    fontSize: "13px",
    textAlign: "center",
  } as React.CSSProperties,
};
