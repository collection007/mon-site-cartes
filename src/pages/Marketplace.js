import React from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { useState } from "react";

const CardItem = ({ image, title, price }) => {
  return (
    <Card className="w-64 shadow-lg rounded-2xl overflow-hidden">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <CardContent>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-600">{price} €</p>
        <Button className="mt-2 w-full">Acheter</Button>
      </CardContent>
    </Card>
  );
};

export default function Marketplace() {
  const [cards, setCards] = useState([
    { id: 1, image: "/images/card1.jpg", title: "Carte France 1995", price: 15 },
    { id: 2, image: "/images/card2.jpg", title: "Carte USA 2001", price: 20 },
    { id: 3, image: "/images/card3.jpg", title: "Carte Japon 1998", price: 25 },
  ]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <CardItem key={card.id} image={card.image} title={card.title} price={card.price} />
      ))}
    </motion.div>
  );
}