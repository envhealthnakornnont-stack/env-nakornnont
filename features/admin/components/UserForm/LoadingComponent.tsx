const LoadingComponent = () => {
    return (
        <div className="m-5 p-16 bg-base-100 rounded-lg shadow">
            <div className="flex flex-col gap-10">
                <div className="self-center skeleton w-24 h-24 rounded-full"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-9">
                    <div className="form-control gap-2">
                        <div className="skeleton w-20 h-5 rounded-lg"></div>
                        <div className="skeleton max-w-[calc(1016px)] h-12 rounded-lg"></div>
                    </div>
                    <div className="form-control gap-2">
                        <div className="skeleton w-20 h-5 rounded-lg"></div>
                        <div className="skeleton max-w-[calc(1016px)] h-12 rounded-lg"></div>
                    </div>
                    <div className="form-control gap-2">
                        <div className="skeleton w-20 h-5 rounded-lg"></div>
                        <div className="skeleton max-w-[calc(1016px)] h-12 rounded-lg"></div>
                    </div>
                    <div className="form-control gap-2">
                        <div className="skeleton w-20 h-5 rounded-lg"></div>
                        <div className="skeleton max-w-[calc(1016px)] h-12 rounded-lg"></div>
                    </div>
                    <div className="form-control gap-2">
                        <div className="skeleton w-20 h-5 rounded-lg"></div>
                        <div className="skeleton max-w-[calc(1016px)] h-12 rounded-lg"></div>
                    </div>
                    <div className="form-control gap-2">
                        <div className="skeleton w-20 h-5 rounded-lg"></div>
                        <div className="skeleton max-w-[calc(1016px)] h-12 rounded-lg"></div>
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <div className="skeleton w-20 h-12 rounded-lg"></div>
                    <div className="skeleton w-20 h-12 rounded-lg"></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingComponent