import React from 'react';
import DefaultLayout from './defaultLayout';
import Nav from './nav';
import Footer from './footer';

class Index extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <DefaultLayout title={this.props.title} {...this.props}>
                <Nav />
                <Footer />
            </DefaultLayout>
        )
    }
}

export default Index