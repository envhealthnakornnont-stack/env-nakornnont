const Loading = () => {
    return (
        <div className="m-5 px-8 md:px-16 py-16 bg-base-100 rounded-lg shadow">
            <div className="flex flex-col gap-10">
                <div className="relative self-center">
                    <div className="skeleton w-[100px] h-[100px] rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                    <div>
                        <div className="skeleton my-2 mx-1 h-5 w-32 rounded-lg"></div>
                        <div className="skeleton h-12 w-full rounded-lg"></div>
                    </div>
                    <div>
                        <div className="skeleton my-2 mx-1 h-5 w-32 rounded-lg"></div>
                        <div className="skeleton h-12 w-full rounded-lg"></div>
                    </div>
                    <div>
                        <div className="skeleton my-2 mx-1 h-5 w-32 rounded-lg"></div>
                        <div className="skeleton h-12 w-full rounded-lg"></div>
                    </div>
                    <div>
                        <div className="skeleton my-2 mx-1 h-5 w-32 rounded-lg"></div>
                        <div className="skeleton h-12 w-full rounded-lg"></div>
                    </div>
                    <div>
                        <div className="skeleton my-2 mx-1 h-5 w-32 rounded-lg"></div>
                        <div className="skeleton h-12 w-full rounded-lg"></div>
                    </div>
                    <div>
                        <div className="skeleton my-2 mx-1 h-5 w-32 rounded-lg"></div>
                        <div className="skeleton h-12 w-full rounded-lg"></div>
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <div className="skeleton h-12 w-[117px] rounded-lg"></div>
                    <div className="skeleton h-12 w-[72px] rounded-lg"></div>
                </div>
            </div>
        </div>
    )
}

export default Loading