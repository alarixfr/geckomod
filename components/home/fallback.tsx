import React from "react";
import Link from "next/link";
import Image from "next/image";

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image skeleton"/>
        <div className="info">
          <div className="header-line-sm skeleton"/>
          <div className="header-lime-lg skeleton" />
        </div>
      </div>
      <div className="chart">
        <div className="chart-skeleton skeleton" />
      </div>
    </div>
  )
}

export const TrendingCoinsFallback = () => {
  const columns = [
    {
      header: 'Name'
      cell: () => (
        <div className="name-link">
          <div className="name-image skeleton" />
          <div className="name-line skeleton" />
        </div>
      )
    }
  ]
}

export const CategoriesFallback = () => {
  const columns = [
    {
      header: 'Category',
      cellClassName: 'category-cell',
      cell: () => <div className="category-line skeleton" />
    },
    {
      header: 'Top Gainers',
      cellClassName: 'top-gainers-cell',
      cell: () => {
        <div className="flex gap-1">
          <div className="gainer-image skeleton" />
          <div className="gainer-image skeleton" />
          <div className="gainer-image skeleton" />
        </div>
      }
    }
  ]
}