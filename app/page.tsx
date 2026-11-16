import React from 'react';
import Image from "next/image";
import Link from "next/link";
import DataTable from "@/components/DataTable.tsx";
import {cn, formatCurrency} from "@/lib/utils";
import {TrendingUp, TrendingDown} from 'lucide-react';

const Page = async () => {
  
  return <main className="main-container">
    <section className="home-grid">
      <Suspense fallback={<div>Loading...</div>}>
      
      </Suspense>
    </section>

    <section className="w-full mt-7 space-y-4">
      <p>Categories</p>
    </section>
  </main>
}

export default Page;