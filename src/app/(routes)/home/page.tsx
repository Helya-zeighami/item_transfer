import AllData from "@/components/AllData";
import SelectedData from "@/components/SelectedData";
import Link from "next/link";

export default function HomePage(){
    return (
        <div className="flex gap-4 p-10 flex-col items-center">
            <Link href='#' className='underline text-blue-800'>Download All Data</Link>
            <div className='flex w-full'>
            <AllData/>
            <SelectedData/>
            </div>
        </div>
    )
}