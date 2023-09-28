import getUsers from "../actions/getUsers";
import Sidebar from "../components/Sidebar/Sidebar";
import UsersList from "./components/UsersList";

const UsersLayout = async ({ children }: { children: React.ReactNode }) => {
    const users = await getUsers();

    return (
        <Sidebar>
            <div className="h-full">
                <UsersList users={users} />
                {children}
            </div>
        </Sidebar>
    );
};

export default UsersLayout;
