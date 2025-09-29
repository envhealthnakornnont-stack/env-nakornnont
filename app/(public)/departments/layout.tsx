export default function DepartmentsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="px-10 py-5 xl:px-20 xl:py-10">
            {children}
        </div>
    )
}