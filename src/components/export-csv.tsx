"use client";

import React from "react";
import { Button } from "./ui/button";

type Props = {
	url: string;
	fileName?: string;
};

const ExportCSV = ({ url, fileName }: Props) => {
	const [isLoading, setIsLoading] = React.useState(false);

	async function fetchData() {
		setIsLoading(true);
		const response = await fetch(url);
		const data = await response.json();
		setIsLoading(false);
		return data;
	}

	const downloadCSV = async () => {
		// Convert the data array into a CSV string

		const { data } = await fetchData();

		// Step 1: Get the headers from the keys of the first object in the array
		const headers = Object.keys(data[0]);

		// Step 2: Map the data into CSV format by extracting the values dynamically
		const csvString = [
			headers, // Use the headers dynamically extracted from the keys
			...data.map((item: any) => headers.map((header) => item[header])), // Map the values based on headers
		];

		// Step 3: Convert the array of arrays into a CSV string
		const formattedCsv = csvString.map((row) => row.join(",")).join("\n");

		// Create a Blob from the CSV string
		const blob = new Blob([formattedCsv], { type: "text/csv" });

		// Generate a download link and initiate the download
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = fileName || "download.csv";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return (
		<Button loading={isLoading} onClick={downloadCSV}>
			Export
		</Button>
	);
};

export default ExportCSV;
