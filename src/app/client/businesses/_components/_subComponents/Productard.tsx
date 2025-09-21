type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  };
  onEdit: (product: ProductCardProps['product']) => void;
  onDelete: (id: string) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  return (
    <div className='border rounded-md p-4'>
      <img
        src={product.imageUrl}
        alt={product.name}
        className='w-full h-32 object-cover rounded-md mb-2'
      />
      <h4 className='text-lg font-semibold'>{product.name}</h4>
      <p className='text-sm text-muted-foreground'>{product.description}</p>
      <p className='text-lg font-bold'>${product.price.toFixed(2)}</p>
      <div className='flex gap-2 mt-4'>
        <button onClick={() => onEdit(product)} className='btn btn-primary'>
          Edit
        </button>
        <button onClick={() => onDelete(product.id)} className='btn btn-danger'>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
