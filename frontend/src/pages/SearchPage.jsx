import React from "react";
import TopBar from "../components/TopBar"
import SearchBox from "../components/SearchBox"
import "./SearchPage.css";

export default function SearchPage() {
    return (
    <div className="Container">
        <TopBar />
        Search Page
        <SearchBox />
    </div>
    );
}
