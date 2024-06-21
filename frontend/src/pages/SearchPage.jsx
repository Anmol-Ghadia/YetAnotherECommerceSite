import React from "react";
import SearchBox from "../components/SearchBox"
import "./SearchPage.css";
import TopBar from "../components/TopBar";

export default function SearchPage() {
    return (
    <div className="Container">
        <TopBar />
        Search Page
        <SearchBox />
    </div>
    );
}
