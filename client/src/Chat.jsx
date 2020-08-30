import React from 'react';
import { 
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    useQuery,
    useMutation,
    gql,
} from '@apollo/client';
// import {
//     Container,
// } from "shards-react";

const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
});

const GET_MESSAGES = gql`
query {
    messages {
      id
      content
      user
    }
  }
`;

const POST_MESSAGE = gql`
mutation ($user:String!, $content:String!) {
    postMessage(user: $user, content: $content)
  }
`;

const Messages = ({ user }) => {
    const { data } = useQuery(GET_MESSAGES, {
        pollInterval: 500,
    });
    if(!data) {
        return null;
    }

    return (
        <>
            {data.messages.map(({ id, user: messageUser, content }) => (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: user == messageUser ? 'flex-end' : 'flex-start',
                        paddingBottom: "1em",
                    }}>
                        {user !== messageUser && (
                            <div
                                style={{
                                    height: 50,
                                    width: 50,
                                    marginRight: '0.5em',
                                    border: '2px solid #e5e6ea',
                                    borderRadius: 25,
                                    textAlign: "center",
                                    fontSize: "18pt",
                                    paddingTop: 5,
                                }}>
                                {messageUser.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div
                            style={{
                                background: user == messageUser ? '#58bf56' : '#e5e6ea',
                                color: user == messageUser ? 'white' : 'black',
                                padding: "1em",
                                borderRadius: "1em",
                                maxWidth: "60%",
                            }}>
                            {content}
                        </div>
                </div>
            ))}
        </>
    );
}

const Chat = () => {
    const [state, stateSet] = React.useState({
        user: 'Jack',
        content: '',
    });
    const [postMessage] = useMutation(POST_MESSAGE);

    const onSend = () => {
        if (state.content.length > 0) {
            postMessage({
                variables: state,
            });
        }
        stateSet({
            ...state,
            content: '',
        })
    };
    return (
        <div>
            <Messages user={state.user} />
            <div style={{
                display: 'flex',
            }}>
                <div style={{
                    display: 'block',
                    padding: 0,
                }}>
                    <input
                        label="User"
                        value={state.user}
                        onChange={(evt) => stateSet({
                            ...state,
                            user: evt.target.value,
                        })}
                    />
                </div>
                <div style={{
                    display: 'block',
                    padding: 0,
                }}>
                    <input
                        label="Content"
                        value={state.content}
                        onChange={(evt) => stateSet({
                            ...state,
                            content: evt.target.value,
                        })}
                        onKeyUp={(evt) => {
                            if (evt.keyCode == 13) {
                                onSend();
                            }
                        }}
                    />
                </div>
                <div style={{
                    display: 'block',
                    padding: 0,
                }}>
                    <button onClick={() => onSend()}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
};

export default () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
);