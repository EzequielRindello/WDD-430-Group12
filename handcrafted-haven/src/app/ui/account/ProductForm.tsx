
export default async function AddProductForm{
    return (
        <form action={} method="post">
            <label>Product Name:
                <input name="title" type="text" required/>
            </label>
            <label>Price: 
                <input name="price" type="number" defaultValue="10.99" required/>
            </label>
            <label>Image URL:
                <input name="images" type="url" multiple/>
            </label>
            <label>Category:
                <select name="category">
                <option value="">Choose a Category</option>
                    <option value="Art">Artwork</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Ceramics">Ceramics</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Textiles">Textiles</option>
                </select>
            </label>
            <label>Description:
                <textarea name="description"/>
            </label>
        </form>
    )
}