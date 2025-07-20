interface EmailTemplateProps {
  firstName?: string;
  connectionLink: string;
}

export function EmailTemplate({
  firstName = 'there',
  connectionLink,
}: EmailTemplateProps) {
  return (
    <div>
      <h1>Hello {firstName},</h1>
      <p>
        Please click the link below to connect your LinkedIn profile with our
        platform:
      </p>
      <p>
        <a href={connectionLink} target='_blank' rel='noopener noreferrer'>
          Connect LinkedIn
        </a>
      </p>
      <p>Thanks,</p>
      <p>Your App Team</p>
    </div>
  );
}
