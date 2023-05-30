import { Form, FormLayout, TextField, Button } from '@shopify/polaris';
import { useEffect, useState, useCallback } from 'react';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';


function AddProduct() {
    const fetch = useAuthenticatedFetch()
    const [data, setdata] = useState({
        title: '',
        body_html: '',
        vendor: '',
        product_type: '',

    })



    const Addproduct = useCallback(() => {
        console.log(data)
        fetch("/api/product/post", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Accept-Encoding": "gzip,deflate,compress",
            }, body: JSON.stringify({ data })
        }).then(res => res
        ).catch((e) => {
            console.log(e)
        })
    }, [data])













    const handleOnChange = useCallback((value, name) => {
        setdata((prevData) => ({ ...prevData, [name]: value })
        )
    }, []);

    return (
        <Form noValidate onSubmit={Addproduct}>
            <FormLayout>
                <TextField
                    value={data.title}
                    onChange={(value) => handleOnChange(value, "title")}
                    label="Title"
                    type="string"
                    autoComplete="off"
                />
                <TextField
                    value={data.body_html}
                    onChange={(value) => handleOnChange(value, "body_html")}
                    label="Description"
                    type="string"
                    autoComplete="off"
                />
                <TextField
                    value={data.vendor}
                    onChange={(value) => handleOnChange(value, "vendor")}
                    label="vendor"
                    type="string"
                    autoComplete="off"
                />
                <TextField
                    value={data.product_type}
                    onChange={(value) => handleOnChange(value, "product_type")}
                    label="Product_type"
                    type="string"
                    autoComplete="off"
                />

                <Button submit>Submit</Button>
            </FormLayout>
        </Form>
    );
}
export default AddProduct