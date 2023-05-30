import { Form, FormLayout, Checkbox, TextField, Button } from '@shopify/polaris';
import { useEffect } from 'react';
import { useState, useCallback } from 'react';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';

function FormOnSubmitExample() {
    const fetch = useAuthenticatedFetch()



    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [dataList, setDataList] = useState()
    const handleEmailChange = useCallback((value, name) => {
        // setData({ ...data, [name]: value })
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }, []);
    //for get data using input field
    // useEffect(() => {
    //     console.log(data)
    // }, [data])



    useEffect(() => {
        fetch("/api/login", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Accept-Encoding": "gzip,deflate,compress",
            }
        }).then(res => res.json()
        ).then((data) => {
            setDataList(data)
        }).catch((err) => {
            console.log(err)
        })


    }, [])
    const handleSubmit = useCallback(() => {
        console.log(data);

        fetch("/api/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Accept-Encoding": "gzip,deflate,compress"
            },
            body: JSON.stringify(data)
        }).then((req, res) => {
            res.text()
                .then(data => {
                    setData({
                        name: '',
                        email: '',
                        password: ''
                    })
                    console.log(resBody)
                }).catch(err => {
                    console.log(err.message)
                })

        }).catch((err) => {
            console.log("foam submittion error")

        });

    }, [data]);

    return (
        <Form onSubmit={handleSubmit}>
            <FormLayout>

                <TextField
                    value={data.name}
                    onChange={(value) => handleEmailChange(value, "name")}
                    label="Name"
                    type="text"
                    autoComplete="Name"

                />
                <TextField
                    value={data.email}
                    onChange={(value) => handleEmailChange(value, "email")}
                    label="Email"
                    type="email"
                    autoComplete="email"

                />
                <TextField
                    value={data.password}
                    onChange={(value) => handleEmailChange(value, "password")}
                    label="Password"
                    type="password"
                    autoComplete="Password"

                />

                <Button submit>Submit</Button>
            </FormLayout>
            <div>
                {dataList?.map((val, index) => (
                    <li key={index}>
                        <p>{val.name}</p>
                        <p>{val.email}</p>
                        <p>{val.password}</p>
                    </li>
                ))}
            </div>
        </Form>
    );
}
export default FormOnSubmitExample