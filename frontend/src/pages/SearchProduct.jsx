import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SummaryApi from '../common'
import VerticalCard from '../components/VerticalCard'

const SearchProduct = () => {

    const query = useLocation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchProduct = async () => {
        setLoading(true)
        const response = await fetch(SummaryApi.searchProduct.url + query.search, {
            method: SummaryApi.searchProduct.method,
        })
        const dataResponse = await response.json()
        setLoading(false)
        setData(dataResponse.data)
    }

    useEffect(() => {
        fetchProduct()
    }, [query])

    return (
        <div className='container max-auto p-4'>
            {
                loading && (
                    <p className='text-lg text-center'>Loading ......</p>
                )
            }
            <p className='text-lg font-semibold my-3'>Search Results: {data.length}</p>
            {
                data.length === 0 && !loading && (
                    <p className='bg-white p-4 text-lg text-center'>No Data Found .....</p>
                )
            }

            {
                data.length !== 0 && !loading && (
                    <VerticalCard loading={loading} data={data} />
                )
            }
        </div>
    )
}

export default SearchProduct