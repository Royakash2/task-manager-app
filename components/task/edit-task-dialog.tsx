import { Edit } from 'lucide-react';
import React from 'react'
import { Button } from '../ui/button';


const EditTaskDialog = () => {
    return (
        <Button variant="outline" size="sm" className="cursor-pointer gap-1.5 text-xs shrink-0">
            <Edit className='h-3.5 w-3.5' />
            Edit Task
        </Button>
    )
}

export default EditTaskDialog;