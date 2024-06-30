import React, { useState } from 'react'
import { Button, TextField } from '@mui/material'
import toasterSuccess from "../../Toaster/toasterSuccess"

const AddExpenseModal = () => {
    const [amountAndtype,setAmountAndType]=useState({
        amount:null,
        type:""
    })
    const [showToaster,setShowToaster]=useState(true)

    const handleChangeForAmountAndType=(e:any)=>{
        setAmountAndType({
            ...amountAndtype,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmitAddExpense=()=>{
        setShowToaster(true)
    }
  return (
    <>
    <div className='container'>
            <TextField id="outlined-basic" label="Enter amount" variant="outlined" name="amount" onChange={handleChangeForAmountAndType} />
            <TextField id="outlined-basic" label="Enter type" variant="outlined"  name="type" onChange={handleChangeForAmountAndType}/>
            <Button onClick={handleSubmitAddExpense}>Submit</Button>
    </div>
    {
        showToaster && <toasterSuccess/>
    }
    </>
  )
}

export default AddExpenseModal