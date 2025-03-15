"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const lotterySchema = z.object({
	draw: z.string().min(1, "Draw is required"),
	dateTitle: z.string().min(1, "Date title is required"),
	date: z.string().min(1, "Date is required"),
	firstPrize: z.string().min(1, "First prize is required"),
	secondPrize: z.string().min(1, "Second prize is required"),
	thirdPrize: z.string().min(1, "Third prize is required"),
	letters: z.string().nullable().optional(),
	serie: z.string().nullable().optional(),
	folio: z.string().nullable().optional(),
});

type LotteryFormValues = z.infer<typeof lotterySchema>;

export function LotteryForm(props: {
	onSubmit: (data: LotteryFormValues) => Promise<void>;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isSubmitSuccessful },
	} = useForm<LotteryFormValues>({
		resolver: zodResolver(lotterySchema),
	});

	async function onSubmit(data: LotteryFormValues) {
		await props.onSubmit(data);
	}

	return (
		<>
			<div className="mb-6">
				<h2 className="text-2xl font-bold tracking-tight">Lottery Form</h2>
				<p className="text-gray-500">Enter lottery draw information below.</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<label htmlFor="draw" className="text-sm font-medium">
							Draw
						</label>
						<input
							{...register("draw")}
							type="text"
							id="draw"
							placeholder="Enter draw number"
							className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
						/>
						{errors.draw && (
							<p className="text-sm text-red-500">{errors.draw.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="dateTitle" className="text-sm font-medium">
							Date Title
						</label>
						<input
							{...register("dateTitle")}
							type="text"
							id="dateTitle"
							placeholder="Enter date title"
							className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
						/>
						{errors.dateTitle && (
							<p className="text-sm text-red-500">{errors.dateTitle.message}</p>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<label htmlFor="date" className="text-sm font-medium">
						Date
					</label>
					<input
						{...register("date")}
						type="text"
						id="date"
						placeholder="Enter date"
						className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
					/>
					{errors.date && (
						<p className="text-sm text-red-500">{errors.date.message}</p>
					)}
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<div className="space-y-2">
						<label htmlFor="firstPrize" className="text-sm font-medium">
							First Prize
						</label>
						<input
							{...register("firstPrize")}
							type="text"
							id="firstPrize"
							placeholder="Enter first prize"
							className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
						/>
						{errors.firstPrize && (
							<p className="text-sm text-red-500">
								{errors.firstPrize.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="secondPrize" className="text-sm font-medium">
							Second Prize
						</label>
						<input
							{...register("secondPrize")}
							type="text"
							id="secondPrize"
							placeholder="Enter second prize"
							className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
						/>
						{errors.secondPrize && (
							<p className="text-sm text-red-500">
								{errors.secondPrize.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="thirdPrize" className="text-sm font-medium">
							Third Prize
						</label>
						<input
							{...register("thirdPrize")}
							type="text"
							id="thirdPrize"
							placeholder="Enter third prize"
							className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
						/>
						{errors.thirdPrize && (
							<p className="text-sm text-red-500">
								{errors.thirdPrize.message}
							</p>
						)}
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<div className="space-y-2">
						<label htmlFor="letters" className="text-sm font-medium">
							Letters
						</label>
						<input
							{...register("letters")}
							type="text"
							id="letters"
							placeholder="Enter letters (optional)"
							className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
						/>
						{errors.letters && (
							<p className="text-sm text-red-500">{errors.letters.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="serie" className="text-sm font-medium">
							Serie
						</label>
						<input
							{...register("serie")}
							type="text"
							id="serie"
							placeholder="Enter serie (optional)"
							className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
						/>
						{errors.serie && (
							<p className="text-sm text-red-500">{errors.serie.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<label htmlFor="folio" className="text-sm font-medium">
							Folio
						</label>
						<input
							{...register("folio")}
							type="text"
							id="folio"
							placeholder="Enter folio (optional)"
							className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
						/>
						{errors.folio && (
							<p className="text-sm text-red-500">{errors.folio.message}</p>
						)}
					</div>
				</div>

				{isSubmitSuccessful && (
					<p className="text-sm text-green-600">Form submitted successfully!</p>
				)}

				<button
					type="submit"
					disabled={isSubmitting}
					className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSubmitting ? "Submitting..." : "Submit"}
				</button>
			</form>

			<div className="mt-8 border-t pt-6">
				<h3 className="text-lg font-semibold mb-3">Resources</h3>
				<ul className="space-y-2 text-sm text-blue-600">
					<li>
						<a
							href="https://www.utctime.net/"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							UTC Time Converter
						</a>
					</li>
					<li>
						<a
							href="https://www.telemetro.com/entretenimiento"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							Telemetro Entertainment
						</a>
					</li>
				</ul>
			</div>
		</>
	);
}
