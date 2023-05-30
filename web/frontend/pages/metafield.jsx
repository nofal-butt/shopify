import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';

import { TextField, Form, FormLayout, Button } from '@shopify/polaris';
import { useState, useCallback } from 'react';

function MetaField() {
    const fetch = useAuthenticatedFetch()
    const [value, setValue] = useState();

    const handleChange = useCallback(
        (value) => {
            setValue(value)
            console.log(value)
        },
        [],
    );
    const handleSubmit = useCallback(() => {
        console.log(value);

        fetch("/api/metafield", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Accept-Encoding": "gzip,deflate,compress"
            },
            body: JSON.stringify({ value })
        }).then((res) => { res.text() })

    }, [value]);


    return (
        <Form onSubmit={handleSubmit}>
            <FormLayout>
                <TextField
                    label="Product Name"
                    value={value}
                    onChange={handleChange}
                    autoComplete="on"
                />
                <Button submit>Submit</Button>
            </FormLayout>
        </Form>
    );
}
export default MetaField