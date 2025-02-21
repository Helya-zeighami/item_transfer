import AllData from "@/components/AllData";
import SelectedData from "@/components/SelectedData";

export default function HomePage(){
    return (
        <div className="flex gap-4 p-10">
            <AllData/>
            <SelectedData/>
        </div>
    )
}