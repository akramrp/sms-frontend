import React, { Fragment, useContext } from "react";
import moment from "moment";

export default function Users() {
    return (
        <>
            <main className="app-main">
                {/* <div className="app-content-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-6"><h1 className="mb-0 fs-3">Users</h1></div>
                            <div className="col-sm-6">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb float-sm-end">
                                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Users</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="app-content mt-4">
                    <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                        <div className="card mb-4">
                            <div className="card-header">
                            <div className="row g-2 align-items-center">
                                <div className="col-12 col-md-4">
                                    <h3 className="card-title">User Directory</h3>
                                </div>
                                <div className="col-12 col-md-8">
                                <div className="d-flex flex-wrap justify-content-md-end gap-2">
                                    <div className="input-group input-group-sm w-auto">
                                        <span className="input-group-text"><i className="bi bi-search" aria-hidden="true" /></span>
                                        <input type="search" id="user-search" className="form-control" placeholder="Search users" aria-label="Search users" style={{ width: 180 }}/>
                                    </div>
                                    <select id="user-role-filter" className="form-select form-select-sm w-auto" aria-label="Filter by role">
                                        <option value="all" selected="">All roles</option>
                                        <option value="administrator">Administrator</option>
                                        <option value="editor">Editor</option>
                                        <option value="author">Author</option>
                                        <option value="subscriber">Subscriber</option>
                                    </select>
                                    <button type="button" className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#modal-add-user" >
                                        <i className="bi bi-person-plus-fill me-1" aria-hidden="true"> {" "} </i> New user
                                    </button>
                                </div>
                                </div>
                            </div>
                            </div>

                            <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle m-0">
                                <thead>
                                    <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img src="./assets/img/user1-128x128.jpg" alt="" className="img-size-32 rounded-circle me-2"/>
                                                <span className="fw-medium">Alexander Pierce</span>
                                            </div>
                                        </td>
                                        <td> alexander.pierce@example.com </td>
                                        <td> <span className="badge text-bg-danger"> Administrator </span> </td>
                                        <td> <span className="badge text-bg-success">Active</span> </td>
                                        <td>Mar 12, 2025</td>
                                        <td className="text-end">
                                            <div className="btn-group btn-group-sm">
                                                <button type="button" className="btn btn-outline-secondary" aria-label="Edit Alexander Pierce">
                                                    <i className="bi bi-eye" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className="btn btn-outline-secondary" aria-label="Edit Alexander Pierce">
                                                    <i className="bi bi-pencil" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-delete-user" aria-label="Delete Alexander Pierce">
                                                    <i className="bi bi-trash" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                    <td>
                                        <div className="d-flex align-items-center">
                                        <img
                                            src="./assets/img/user3-128x128.jpg"
                                            alt=""
                                            className="img-size-32 rounded-circle me-2"
                                        />
                                        <span className="fw-medium">Sarah Bullock</span>
                                        </div>
                                    </td>
                                    <td>sarah.bullock@example.com</td>
                                    <td>
                                        <span className="badge text-bg-primary">Editor</span>
                                    </td>
                                    <td>
                                        <span className="badge text-bg-success">Active</span>
                                    </td>
                                    <td>Apr 3, 2025</td>
                                    <td className="text-end">
                                        <div className="btn-group btn-group-sm">
                                            <button type="button" className="btn btn-outline-secondary" aria-label="Edit Alexander Pierce">
                                                    <i className="bi bi-eye" aria-hidden="true"></i>
                                                </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            aria-label="Edit Sarah Bullock"
                                        >
                                            <i className="bi bi-pencil" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal-delete-user"
                                            aria-label="Delete Sarah Bullock"
                                        >
                                            <i className="bi bi-trash" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        </div>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <div className="d-flex align-items-center">
                                        <img
                                            src="./assets/img/user6-128x128.jpg"
                                            alt=""
                                            className="img-size-32 rounded-circle me-2"
                                        />
                                        <span className="fw-medium">Daniel Cooper</span>
                                        </div>
                                    </td>
                                    <td>daniel.cooper@example.com</td>
                                    <td>
                                        <span className="badge text-bg-info">Author</span>
                                    </td>
                                    <td>
                                        <span className="badge text-bg-warning">Pending</span>
                                    </td>
                                    <td>Apr 28, 2025</td>
                                    <td className="text-end">
                                        <div className="btn-group btn-group-sm">
                                            <button type="button" className="btn btn-outline-secondary" aria-label="Edit Alexander Pierce">
                                                    <i className="bi bi-eye" aria-hidden="true"></i>
                                                </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            aria-label="Edit Daniel Cooper"
                                        >
                                            <i className="bi bi-pencil" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal-delete-user"
                                            aria-label="Delete Daniel Cooper"
                                        >
                                            <i className="bi bi-trash" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        </div>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <div className="d-flex align-items-center">
                                        <img
                                            src="./assets/img/user4-128x128.jpg"
                                            alt=""
                                            className="img-size-32 rounded-circle me-2"
                                        />
                                        <span className="fw-medium">Nora Vans</span>
                                        </div>
                                    </td>
                                    <td>nora.vans@example.com</td>
                                    <td>
                                        <span className="badge text-bg-primary">Editor</span>
                                    </td>
                                    <td>
                                        <span className="badge text-bg-success">Active</span>
                                    </td>
                                    <td>May 9, 2025</td>
                                    <td className="text-end">
                                        <div className="btn-group btn-group-sm">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            aria-label="Edit Nora Vans"
                                        >
                                            <i className="bi bi-pencil" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal-delete-user"
                                            aria-label="Delete Nora Vans"
                                        >
                                            <i className="bi bi-trash" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        </div>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <div className="d-flex align-items-center">
                                        <img
                                            src="./assets/img/user7-128x128.jpg"
                                            alt=""
                                            className="img-size-32 rounded-circle me-2"
                                        />
                                        <span className="fw-medium">Jane Holland</span>
                                        </div>
                                    </td>
                                    <td>jane.holland@example.com</td>
                                    <td>
                                        <span className="badge text-bg-secondary">
                                        {" "}
                                        Subscriber{" "}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge text-bg-success">Active</span>
                                    </td>
                                    <td>May 21, 2025</td>
                                    <td className="text-end">
                                        <div className="btn-group btn-group-sm">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            aria-label="Edit Jane Holland"
                                        >
                                            <i className="bi bi-pencil" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal-delete-user"
                                            aria-label="Delete Jane Holland"
                                        >
                                            <i className="bi bi-trash" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        </div>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <div className="d-flex align-items-center">
                                        <img
                                            src="./assets/img/user8-128x128.jpg"
                                            alt=""
                                            className="img-size-32 rounded-circle me-2"
                                        />
                                        <span className="fw-medium">Kenneth Miles</span>
                                        </div>
                                    </td>
                                    <td>kenneth.miles@example.com</td>
                                    <td>
                                        <span className="badge text-bg-info">Author</span>
                                    </td>
                                    <td>
                                        <span className="badge text-bg-danger">
                                        {" "}
                                        Suspended{" "}
                                        </span>
                                    </td>
                                    <td>Jun 2, 2025</td>
                                    <td className="text-end">
                                        <div className="btn-group btn-group-sm">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            aria-label="Edit Kenneth Miles"
                                        >
                                            <i className="bi bi-pencil" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal-delete-user"
                                            aria-label="Delete Kenneth Miles"
                                        >
                                            <i className="bi bi-trash" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        </div>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <div className="d-flex align-items-center">
                                        <img
                                            src="./assets/img/user2-160x160.jpg"
                                            alt=""
                                            className="img-size-32 rounded-circle me-2"
                                        />
                                        <span className="fw-medium"> Nadia Carmichael </span>
                                        </div>
                                    </td>
                                    <td>nadia.carmichael@example.com</td>
                                    <td>
                                        <span className="badge text-bg-secondary">
                                        {" "}
                                        Subscriber{" "}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge text-bg-success">Active</span>
                                    </td>
                                    <td>Jun 15, 2025</td>
                                    <td className="text-end">
                                        <div className="btn-group btn-group-sm">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            aria-label="Edit Nadia Carmichael"
                                        >
                                            <i className="bi bi-pencil" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal-delete-user"
                                            aria-label="Delete Nadia Carmichael"
                                        >
                                            <i className="bi bi-trash" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        </div>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <div className="d-flex align-items-center">
                                        <img
                                            src="./assets/img/user5-128x128.jpg"
                                            alt=""
                                            className="img-size-32 rounded-circle me-2"
                                        />
                                        <span className="fw-medium">Marcus Reed</span>
                                        </div>
                                    </td>
                                    <td>marcus.reed@example.com</td>
                                    <td>
                                        <span className="badge text-bg-primary">Editor</span>
                                    </td>
                                    <td>
                                        <span className="badge text-bg-warning">Pending</span>
                                    </td>
                                    <td>Jun 24, 2025</td>
                                    <td className="text-end">
                                        <div className="btn-group btn-group-sm">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            aria-label="Edit Marcus Reed"
                                        >
                                            <i className="bi bi-pencil" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal-delete-user"
                                            aria-label="Delete Marcus Reed"
                                        >
                                            <i className="bi bi-trash" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        </div>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <div className="d-flex align-items-center">
                                        <img
                                            src="./assets/img/avatar5.png"
                                            alt=""
                                            className="img-size-32 rounded-circle me-2"
                                        />
                                        <span className="fw-medium">Elena Weber</span>
                                        </div>
                                    </td>
                                    <td>elena.weber@example.com</td>
                                    <td>
                                        <span className="badge text-bg-secondary">
                                        {" "}
                                        Subscriber{" "}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge text-bg-success">Active</span>
                                    </td>
                                    <td>Jul 1, 2025</td>
                                    <td className="text-end">
                                        <div className="btn-group btn-group-sm">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            aria-label="Edit Elena Weber"
                                        >
                                            <i className="bi bi-pencil" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal-delete-user"
                                            aria-label="Delete Elena Weber"
                                        >
                                            <i className="bi bi-trash" aria-hidden="true">
                                            {" "}
                                            </i>
                                        </button>
                                        </div>
                                    </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            </div>

                            {/*begin::Card Footer*/}
                            <div className="card-footer clearfix">
                            <div className="float-start pt-1 fs-7 text-body-secondary">Showing 1 to 9 of 42 users</div>
                            <ul className="pagination pagination-sm m-0 float-end">
                                <li className="page-item disabled">
                                <a className="page-link" href="#" aria-label="Previous">{" "}«{" "}</a></li>
                                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item"><a className="page-link" href="#">4</a></li>
                                <li className="page-item"><a className="page-link" href="#">5</a></li>
                                <li className="page-item"><a className="page-link" href="#" aria-label="Next">{" "}»{" "}</a></li>
                            </ul>
                            </div>
                        </div>
                        </div>
                    </div>


                    {/*begin::Add User Modal*/}
                    <div
                        className="modal fade"
                        id="modal-add-user"
                        tabIndex={-1}
                        aria-labelledby="modal-add-user-label"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog">
                        <div className="modal-content">
                            <form>
                            <div className="modal-header">
                                <h5 className="modal-title" id="modal-add-user-label"> Add new user </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="new-user-name" className="form-label"> Full name </label>
                                    <input type="text" className="form-control" id="new-user-name" placeholder="e.g. Jane Doe" required=""/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="new-user-email" className="form-label">Email address </label>
                                    <input type="email" className="form-control" id="new-user-email" placeholder="name@example.com" required=""/>
                                    <div className="form-text">The invitation will be sent to this address.</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="new-user-role" className="form-label">Role</label>
                                    <select id="new-user-role" className="form-select">
                                        <option selected="">Subscriber</option>
                                        <option>Author</option>
                                        <option>Editor</option>
                                        <option>Administrator</option>
                                    </select>
                                </div>
                                <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="new-user-welcome" defaultChecked=""/>
                                <label className="form-check-label" htmlFor="new-user-welcome">Send a welcome mail with login details</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Create User</button>
                            </div>
                            </form>
                        </div>
                        </div>
                    </div>
                    {/*end::Add User Modal*/}

                    {/*begin::Delete User Modal*/}
                    <div
                        className="modal fade"
                        id="modal-delete-user"
                        tabIndex={-1}
                        aria-labelledby="modal-delete-user-label"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modal-delete-user-label"> Delete User </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                            </div>
                            <div className="modal-body">
                                <p className="mb-0">
                                    Are you sure you want to delete this user? All content owned by
                                    the account will be reassigned to the site administrator. This
                                    action cannot be undone.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Delete User</button>
                            </div>
                        </div>
                        </div>
                    </div>

                    </div>
                </div>
            </main>
        </>
    );
}