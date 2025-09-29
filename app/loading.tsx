export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex gap-2 p-2 items-center">
                <div className="flex flex-1 items-center mx-2 gap-2">
                    <div className="skeleton h-12 w-12 rounded-full"></div>
                    <div className="skeleton h-8 w-44 rounded-full"></div>
                </div>
                <div>
                    <div className="skeleton h-12 w-[60px] rounded-lg"></div>
                </div>
                <div>
                    <div className="skeleton h-12 w-10 rounded-lg"></div>
                </div>
            </div>
            <div className="skeleton h-[450px] w-full rounded-none"></div>
            <div className="skeleton h-[512px] w-full rounded-none"></div>
            <div className="flex flex-col items-center gap-6">
                <div className="skeleton h-8 w-36"></div>
                <div className="skeleton h-[392px] w-full rounded-none"></div>
            </div>
            <div className="px-10 py-5 flex flex-col">
                <div className="skeleton h-8 w-56 rounded-full mb-12"></div>
                <div className="skeleton h-[333px] w-full rounded-xl"></div>
                <div className="skeleton h-11 w-24 rounded-lg my-12 self-center"></div>
            </div>
            <div className="px-10 py-5 flex flex-col">
                <div className="skeleton h-8 w-56 rounded-full mb-12"></div>
                <div className="skeleton h-[333px] w-full rounded-xl"></div>
                <div className="skeleton h-11 w-24 rounded-lg my-12 self-center"></div>
            </div>
            <div className="flex flex-col items-center gap-6 px-10 py-5">
                <div className="skeleton h-9 w-48 md:w-60"></div>
                <div className="skeleton h-[333px] md:h-[516px] w-full rounded-lg"></div>
            </div>
            <div className="flex flex-col items-center p-8">
                <div className="skeleton h-[120px] w-[120px] rounded-full"></div>
                <div className="skeleton h-[112px] md:h-14 w-[285px] md:w-[380px] rounded-lg my-4"></div>
            </div>
            <div className="flex flex-col items-center px-10 py-4">
                <div className="flex gap-4">
                    <div className="skeleton h-6 w-8 rounded-lg"></div>
                    <div className="skeleton h-6 w-8 rounded-lg"></div>
                    <div className="skeleton h-6 w-8 rounded-lg"></div>
                </div>
                <div className="flex justify-center items-center gap-4">
                    <div className="skeleton h-6 w-8 rounded-lg"></div>
                    <div className="skeleton h-10 w-[300px] md:w-[443px] rounded-lg my-4"></div>
                </div>
            </div>
        </div>
    )
}