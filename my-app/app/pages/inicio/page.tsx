'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "../../ui/card";
import { Star, MapPin } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../ui/carousel";

interface Hotel {
    id: number;
    name: string;
    location: string;
    price: number;
    rating: number;
    imageUrl: string;
    amenities: string[];
}

const hotels: Hotel[] = [
    {
        id: 1,
        name: "Grand Luxury Hotel",
        location: "New York, USA",
        price: 299,
        rating: 4.8,
        imageUrl: "https://images.unsplash.com/photo-1634041441461-a1789d008830?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MDcwNzk4MXww&ixlib=rb-4.1.0&q=80&w=1080",
        amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
    },
    {
        id: 2,
        name: "Modern Suite Hotel",
        location: "Los Angeles, USA",
        price: 249,
        rating: 4.6,
        imageUrl: "https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYwNzA3OTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        amenities: ["Free WiFi", "Gym", "Bar", "Room Service"],
    },
    {
        id: 3,
        name: "Boutique Charm Inn",
        location: "Paris, France",
        price: 189,
        rating: 4.9,
        imageUrl: "https://images.unsplash.com/photo-1649731000184-7ced04998f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsfGVufDF8fHx8MTc2MDYxNjIyMHww&ixlib=rb-4.1.0&q=80&w=1080",
        amenities: ["Free WiFi", "Breakfast", "Concierge"],
    },
    {
        id: 4,
        name: "Paradise Resort",
        location: "Maldives",
        price: 599,
        rating: 5.0,
        imageUrl: "https://images.unsplash.com/photo-1629997777186-3ccf91c2e009?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjBob3RlbCUyMHBvb2x8ZW58MXx8fHwxNzYwNjgxODg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        amenities: ["All Inclusive", "Private Beach", "Spa", "Pool"],
    },
    {
        id: 5,
        name: "Beachfront Escape",
        location: "Bali, Indonesia",
        price: 349,
        rating: 4.7,
        imageUrl: "https://images.unsplash.com/photo-1729717949780-46e511489c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGhvdGVsJTIwcmVzb3J0fGVufDF8fHx8MTc2MDY1OTk5OXww&ixlib=rb-4.1.0&q=80&w=1080",
        amenities: ["Beach Access", "Pool", "Restaurant", "Bar"],
    },
    {
        id: 6,
        name: "Metropolitan Tower",
        location: "Dubai, UAE",
        price: 449,
        rating: 4.8,
        imageUrl: "https://images.unsplash.com/photo-1640235150002-536c5c4a0beb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwaG90ZWwlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjA2NzUzMzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        amenities: ["Rooftop Bar", "Spa", "Gym", "Fine Dining"],
    },
];



export default function HotelCarousel() {

    async function getRecommendation(){
        const response = await fetch(`/api/recommendations`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        console.log(await response.json())
    }

    useEffect(()=>{
        getRecommendation()
    },[])



    return (
        <div className="w-full mt-10 px-4 md:px-8 lg:px-16">
            <div className="mb-8">
                <h2 className="mb-2">Featured Hotels</h2>
                <p className="text-muted-foreground">
                    Discover amazing places to stay around the world
                </p>
            </div>

            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {hotels.map((hotel) => (
                        <CarouselItem key={hotel.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="relative h-48 md:h-56 overflow-hidden">

                                    <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm">{hotel.rating}</span>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="mb-2">{hotel.name}</h3>
                                    <div className="flex items-center gap-1 text-muted-foreground mb-3">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{hotel.location}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {hotel.amenities.slice(0, 3).map((amenity, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-secondary rounded-md text-sm"
                                            >
                        {amenity}
                      </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-border">
                                        <div>
                                            <span className="text-muted-foreground text-sm">From</span>
                                            <p className="text-primary">
                                                ${hotel.price}
                                                <span className="text-sm text-muted-foreground">/night</span>
                                            </p>
                                        </div>
                                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                                            Book Now
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
        </div>
    );
}