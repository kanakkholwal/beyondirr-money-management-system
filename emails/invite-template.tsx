import { Body, Button, Container, Head, Heading, Html, Preview, render, Text } from '@react-email/components';
import React from 'react';

interface InviteEmailProps {
    name: string;
    hostName: string;
    date: string;
    venue: string;
    inviteLink: string;
}

export const InviteEmail: React.FC<InviteEmailProps> = ({
    name,
    hostName,
    date,
    venue,
    inviteLink
}) => {
    return (
        <Html>
            <Head />
            <Preview>{`You're invited to ${name}!`}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>{name}</Heading>
                    <Text style={paragraph}>Hi there,</Text>
                    <Text style={paragraph}>
                        You are invited by <strong>{hostName}</strong> to attend the event <strong>{name}</strong> on <strong>{date}</strong> at <strong>{venue}</strong>.
                    </Text>
                    <Text style={paragraph}>
                        We hope you can join us for this special occasion!
                    </Text>

                    <Button href={inviteLink} style={button}>
                        Join the event
                    </Button>
                    <Text style={paragraph}>
                        Best regards,<br />
                        {hostName}
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};


export const getInviteEmailHTML = (data:InviteEmailProps) =>{
    const emailHtml = render(<InviteEmail {...data}/>);
    
    return emailHtml;
}


const main = {
    backgroundColor: '#f4f4f4',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const heading = {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333333',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#555555',
    marginBottom: '20px',
};

const button = {
    display: 'inline-block',
    backgroundColor: '#007BFF',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
};

