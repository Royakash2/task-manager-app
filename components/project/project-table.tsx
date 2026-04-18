
import { DataTable } from "../data-table";
import { columns, TaskTableItem } from "./columns";
export const ProjectTable = ({
    tasks
}: {tasks: TaskTableItem[]}) => {
    return (
        <>
        <DataTable
        data={tasks}
        columns={columns}
        />
        </>
    );
};
