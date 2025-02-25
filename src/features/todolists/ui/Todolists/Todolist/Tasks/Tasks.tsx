import List from "@mui/material/List"
import { TaskStatus } from "common/enums"
import { DEFAULT_PAGE_SIZE, useGetTasksQuery } from "../../../../api/tasksApi"
import { DomainTodolist } from "../../../../lib/types/types"
import { TasksSkeleton } from "../../../skeletons/TasksSkeleton/TasksSkeleton"
import { Task } from "./Task/Task"
import { useState } from "react"
import { TasksPagination } from "../TasksPagination/TasksPagination"

type Props = {
  todolist: DomainTodolist
}

const DEFAULT_PAGINATION_START_PAGE = 1

export const Tasks = ({ todolist }: Props) => {
  const [page, setPage] = useState<number>(DEFAULT_PAGINATION_START_PAGE)

  const { data, isLoading } = useGetTasksQuery({
    todolistId: todolist.id,
    args: { page },
  })

  let tasksForTodolist = data?.items

  if (todolist.filter === "active") {
    tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.New)
  }

  if (todolist.filter === "completed") {
    tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {tasksForTodolist?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>{tasksForTodolist?.map((task) => <Task key={task.id} task={task} todolist={todolist} />)}</List>
      )}

      {(data?.totalCount ?? 0) > DEFAULT_PAGE_SIZE && (
        <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={setPage} />
      )}
    </>
  )
}
