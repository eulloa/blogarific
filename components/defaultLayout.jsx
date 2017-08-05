import React from 'react';

const Test = (props) => {
    return (
        <html>
            <head>
                <title>{props.title}</title>
                <link href="/css/main.css" rel="stylesheet" />
            </head>
            <body>{props.children}</body>
        </html>
    )
}

export default Test