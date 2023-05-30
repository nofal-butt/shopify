import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Avatar,
    LegacyStack,
    TextField,
    Modal, Button, ResourceList, Pagination
} from '@shopify/polaris';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import SkeletonExample from "./Skeleton"


function Table() {
    const resourceName = {
        singular: 'product',
        plural: 'products',
    };
    const [active, setActive] = useState(false);

    const toggleActive = useCallback(() => setActive((active) => !active), []);
    const fetch = useAuthenticatedFetch()
    const [product, setProduct] = useState()

    useEffect(() => {

        fetch("/api/product/get", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Accept-Encoding": "gzip,deflate,compress",
            }
        }).then(res => res.json()
        ).then((data) => {
            // setDataList(data)
            setProduct(data.data.products)
            console.log(data.data.products)
        })
            .catch((err) => {
                console.log(err)
            })

    }, [])


    //-----------pagination---------
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = product?.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    //------------------------------------------



    const deleteData = async (id) => {
        // console.log(id)
        fetch("/api/product/delete", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Accept-Encoding": "gzip,deflate,compress",
            }, body: JSON.stringify({ id })
        }).then(res => res.json()
        ).catch((err) => {
            console.log(err)
        })
    }

    const [data, setData] = useState({
        id: "",
        title: ''
    });



    const handleChange = useCallback((value, name) => {
        console.log(value)
        setData((preData) => ({
            ...preData,
            [name]: value
        })
        )

    });

    const handleUpdate = useCallback((id) => {
        toggleActive();
        setData({ ...data, id: id })
    }, [])

    const updateName = () => {
        console.log(data)
        fetch("/api/product/put", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Accept-Encoding": "gzip,deflate,compress",
            }, body: JSON.stringify({ data })
        })
            .then((res) => { res.text() })
            .catch((err) => {
                console.log(err);
            })
    }




    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(product);

    const rowMarkup = currentProducts?.map(
        (
            // { id, Product, date, customer, total, paymentStatus, fulfillmentStatus },
            { id, title, image },
            index,
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>
                    {image && <Avatar customer size="medium" source={image.src} />}
                </IndexTable.Cell>
                <IndexTable.Cell>{id}</IndexTable.Cell>
                <IndexTable.Cell>{title}</IndexTable.Cell>

                <IndexTable.Cell><Button plain destructive onClick={() => deleteData(id)}>
                    Remove
                </Button></IndexTable.Cell>
                <IndexTable.Cell>
                    {<Button plain destructive onClick={() => { handleUpdate(id) }}>
                        Update
                    </Button>}
                </IndexTable.Cell>

            </IndexTable.Row>
        ),
    );

    return (
        <>
            <LegacyCard>
                {currentProducts?.length > 0 ?
                    <IndexTable
                        resourceName={resourceName}
                        itemCount={currentProducts?.length}
                        selectedItemsCount={allResourcesSelected ? 'All' : selectedResources?.length}
                        onSelectionChange={handleSelectionChange}
                        headings={[
                            { title: 'Images' },
                            { title: 'Id' },
                            { title: 'Title' },

                            { title: 'Delete' },
                            { title: 'Update' },
                            // { title: 'Fulfillment status' },
                        ]}
                    >
                        {rowMarkup}
                    </IndexTable>
                    : <SkeletonExample />}
                {/* pagination------------ */}
                <Pagination
                    hasPrevious={currentPage > 1}
                    hasNext={currentProducts?.length === itemsPerPage}
                    onPrevious={() => handlePageChange(currentPage - 1)}
                    onNext={() => handlePageChange(currentPage + 1)}
                />

            </LegacyCard>
            <div style={{ height: '500px' }}>
                <Modal
                    small
                    // activator={activator}
                    open={active}
                    onClose={toggleActive}
                    title="Update"
                    // onClick={handleUpdate}
                    primaryAction={{
                        content: 'Rename Title',
                        onAction: updateName,

                    }}
                    secondaryActions={[
                        {
                            content: 'Cancel',
                            onAction: toggleActive,
                        },
                    ]}
                >
                    <Modal.Section>
                        <LegacyStack vertical>
                            <TextField
                                type="text"
                                value={data.title}
                                onChange={(value) => handleChange(value, "title")}
                                autoComplete="off"
                            />
                        </LegacyStack>
                    </Modal.Section>
                </Modal>
            </div>

        </>
    );
}

export default Table