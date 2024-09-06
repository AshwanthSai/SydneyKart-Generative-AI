/* Since exporting Single Function, we need to destructure */

export const getProducts = async(req, res) => {
    return res.status(200).json({ message: 'All Products Found' });
}

