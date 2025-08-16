export default function Loading() {
	// Stack uses React Suspense, which will render this page while user data is being fetched.
	// See: https://nextjs.org/docs/app/api-reference/file-conventions/loading
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md text-center p-6 bg-white rounded-lg shadow-lg">
				{/* Skeleton para el título */}
				<div className="h-10 bg-gray-200 rounded-md w-3/4 mx-auto animate-pulse"></div>

				{/* Skeleton para el enlace */}
				<div className="mt-6">
					<div className="h-8 bg-gray-200 rounded-md w-1/2 mx-auto animate-pulse"></div>
				</div>
			</div>
		</div>
	);
}
