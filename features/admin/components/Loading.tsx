const Loading = () => {
    return (
        <div className="m-3 p-2 sm:m-3 sm:p-3 lg:m-4 lg:p-3 xl:m-5 xl:p-5 flex flex-col h-[calc(100vh-106px)] bg-base-100 rounded-lg shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="skeleton h-8 lg:h-12 w-[154px] md:w-[201px] lg:w-[296px] rounded-lg"></div>
                    <div className="skeleton h-8 lg:h-12 w-[105px] lg:w-[168px] rounded-lg m-1 md:mx-3"></div>
                </div>
                <div className="skeleton h-8 lg:h-12 w-[38px] lg:w-[117px] rounded-lg"></div>
            </div>
            <div className="overflow-x-auto mt-6 grow">
                <div className="skeleton h-full w-full"></div>
            </div>
        </div>
    )
}

export default Loading