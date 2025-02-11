import React, { useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout"
import { toast } from "react-toastify";
import { Loader } from "../Layout/Loader";
import MetaData from "../Layout/MetaData";
import { useDeleteUserMutation, useGetUsersQuery } from "../../store/api/userApi";

const ListUsers = () => {
  const { data, isLoading, error } = useGetUsersQuery();
  const users = data?.users || ""
  const [deleteUser, {isError: deleteUserIsError, isLoading : deleteUserIsLoading, error : deleteUserError, isSuccess : deleteUserSucess }]
    = useDeleteUserMutation(); 

  const deleteUserHandler = (id) => async(e) => {
    await deleteUser(id)
  } 

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteUserIsError) {
      toast.error(deleteUserError?.data?.message);
    }
    if(deleteUserSucess){
      toast.success("Product Deleted Successfully")
    } 

  }, [error, deleteUserIsError, deleteUserSucess]);


  const setUsers = () => {
    
    const users = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
          sort: "asc",
        },
        {
            label: "Actions",
            field: "actions",
            sort: "asc",
          },
      ],
      rows: [],
    };

    data?.users?.forEach((user) => {
        users.rows.push({
        id: user?._id,
        name: user?.name,
        email: `${user?.email}`,
        role: user?.role,
        actions: (
          <>
            <Link
              to={`/admin/user/${user._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
                 className="btn btn-outline-danger ms-2"
                 onClick={deleteUserHandler(user?._id)}
                 disabled={deleteUserIsLoading}
            >
              <i className="fa fa-trash danger"></i>
            </button>
          </>
        ),
      });
    });

    return users;
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <MetaData title={"All Users"} />

      <h1 className="my-5">{users?.length} Users</h1>

      <MDBDataTable
        data={setUsers()}
        className="px-3"
        bordered
        striped
        hover
      />
    </AdminLayout>
  );
};

export default ListUsers;