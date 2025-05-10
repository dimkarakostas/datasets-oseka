"use client"

import { useRef } from "react"
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Colors } from "chart.js"
import { Line } from "react-chartjs-2"

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Colors)

interface InvestmentFlowChartProps {
  data: Record<string, Array<[string, number]>>
}

export function InvestmentFlowChart({ data }: InvestmentFlowChartProps) {
  const chartRef = useRef<Chart | null>(null)

  // Process data for chart
  const dates = Object.keys(data).sort()
  const formattedDates = dates.map((date) => {
    const [year, month] = date.split("-")
    return `${month}/${year}`
  })

  // Extract data for each category
  const categories = ["Equity", "Bond", "Mixed", "Other", "Total"]
  const datasets = categories.map((category) => {
    const values = dates.map((date) => {
      const categoryData = data[date].find((item) => item[0] === category)
      return categoryData ? categoryData[1] : 0
    })

    return {
      label:
        category === "Equity"
          ? "Μετοχές"
          : category === "Bond"
            ? "Ομόλογα"
            : category === "Mixed"
              ? "Μικτά"
              : category === "Other"
                ? "Άλλα"
                : "Σύνολο",
      data: values,
      borderWidth: category === "Total" ? 3 : 2,
      borderDash: category === "Total" ? [] : undefined,
      tension: 0.1,
      hidden: category === "Total" ? false : false,
    }
  })

  const chartData = {
    labels: formattedDates,
    datasets,
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Καθαρή Ροή (€)",
        },
        ticks: {
          callback: (value: any) => {
            if (value >= 1000000000) {
              return (value / 1000000000).toFixed(1) + "δις"
            }
            if (value >= 1000000) {
              return (value / 1000000).toFixed(0) + "εκ"
            }
            if (value <= -1000000000) {
              return (value / 1000000000).toFixed(1) + "δις"
            }
            if (value <= -1000000) {
              return (value / 1000000).toFixed(0) + "εκ"
            }
            return value
          },
        },
      },
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 0,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              const value = context.parsed.y
              if (value >= 1000000000) {
                label += (value / 1000000000).toFixed(2) + " δις €"
              } else if (value >= 1000000) {
                label += (value / 1000000).toFixed(2) + " εκ €"
              } else if (value <= -1000000000) {
                label += (value / 1000000000).toFixed(2) + " δις €"
              } else if (value <= -1000000) {
                label += (value / 1000000).toFixed(2) + " εκ €"
              } else {
                label += new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" }).format(value)
              }
            }
            return label
          },
        },
      },
    },
  }

  return <Line data={chartData} options={options} />
}
