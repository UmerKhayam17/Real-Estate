// app/components/FindAgent/FindAgent.jsx
"use client";
import React, { useState } from 'react';
import HeaderBackgroundImage from "@/public/agent/agent-search-landing-background.jpg";
import AgentCard from './components/AgentCard';
import CompanyCard from './components/CompanyCard';
import SearchFilters from './components/SearchFilters';
import SubHeader from './components/SubHeader';

const FindAgent = () => {
  const [activeTab, setActiveTab] = useState('agents');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const agentsData = [
    {
      id: 1,
      name: "Thomas Barnett",
      title: "Senior Sales & Leasing Consultant",
      type: "SuperAgent",
      rating: 5.0,
      nationality: "United Kingdom",
      languages: ["English"],
      forSale: 1,
      forRent: 4,
      image: "https://www.propertyfinder.ae/agent/0/260/200/MODE/77ac1c/238866-171f2o.jpg?ctr=ae",
      companyImage: "https://www.propertyfinder.ae/broker/0/260/200/MODE/b49a49/6284-0f2d8o.jpg?ctr=ae"
    },
    {
      id: 2,
      name: "Thomas Barnett",
      title: "Senior Sales & Leasing Consultant",
      type: "SuperAgent",
      rating: 5.0,
      nationality: "United Kingdom",
      languages: ["English"],
      forSale: 1,
      forRent: 4,
      image: "https://www.propertyfinder.ae/agent/0/260/200/MODE/ae0736/252616-ba393o.jpg?ctr=ae",
      companyImage: "https://www.propertyfinder.ae/broker/0/260/200/MODE/c2c81f/5188-15179o.webp?ctr=ae"
    },
  ];

  const companiesData = [
    {
      id: 1,
      name: "Elite Property Brokerage",
      office: "Head office",
      location: "Dubai",
      agents: 27,
      superAgents: 26,
      forSale: 358,
      forRent: 81,
      image: "https://www.propertyfinder.ae/broker/0/260/200/MODE/c2c81f/5188-15179o.webp?ctr=ae"
    },
    {
      id: 2,
      name: "Elite Property Brokerage",
      office: "Head office",
      location: "Dubai",
      agents: 27,
      superAgents: 26,
      forSale: 358,
      forRent: 81,
      image: "https://www.propertyfinder.ae/broker/0/260/200/MODE/b49a49/6284-0f2d8o.jpg?ctr=ae"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HeaderBackgroundImage.src})` }}
      >
        <div className="absolute inset-0 bg-primary-950/30"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl p-2 md:text-5xl font-bold text-white mb-6 font-heading">
            Find Your Perfect Partner
          </h1>

          <SearchFilters
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      {/* SubHeader Section */}
      <SubHeader activeTab={activeTab} />

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
          {activeTab === 'agents' ? (
            agentsData.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))
          ) : (
            companiesData.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FindAgent;