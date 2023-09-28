import getCurrentUser from "@/app/actions/getCurrentUser";
import { MobileFooter } from "./MobileFooter";
import SideHeader from "./SideHeader";

const Sidebar = async ({ children }: { children: React.ReactNode }) => {
    const currentUser = await getCurrentUser();

    return (
        <div className="h-full">
            <SideHeader currentUser={currentUser!} />
            <MobileFooter currentUser={currentUser!} />
            <main className="lg:pt-20 h-full">{children}</main>
        </div>
    );
};

export default Sidebar;
