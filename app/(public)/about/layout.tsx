export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col px-10 py-5 xl:px-20 xl:py-10">
            {children}
        </div>
    )
}