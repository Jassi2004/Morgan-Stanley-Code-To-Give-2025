import CircularGallery from './CirclularGallery'
function Awards() {
  return (
<div style={{ backgroundColor:'#f3e9dc' ,height: '600px', position: 'relative' }}>
  <CircularGallery bend={4} textColor="#black" borderRadius={0.05} />
</div>
  );
}

export default Awards;